import express from "express";
import Todo from "../models/todo";
import mongoose from "mongoose";
const router = express.Router();

//Get (Get Todos)
router.get("/", async (req: any, res: any) => {
    try {
        //Query Completed
        const { completed } = req.query;
        let query :any= {};
        if (completed === "true") query.completed = true;
        if (completed === "false") query.completed = false;
        const todos = await Todo.find(query);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Sunucu Hatası Oluştu!" })
    }
});

//Post (Add New Todo)
router.post("/", async (req: any, res: any) => {
    try {
        //Object Destructing yaparak direkt title'ı alıyoruz.
        const { title } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Todo Boş olamaz" });
        }
        const newTodo = new Todo({ title });
        //db'ye kaydediyoruz.
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: "Todo Eklenemedi !" });
    }
})
//Put/Update (Update Todo)
router.put("/:id", async (req: any, res: any) => {
    try {
        const { title, completed } = req.body;
        const todoId = req.params.id;

        // ID'nin geçerli olup olmadığını kontrol et
        if (!mongoose.Types.ObjectId.isValid(todoId)) {
            return res.status(400).json({ message: "Geçersiz ID formatı!" });
        }

        const isTodoExist = await Todo.findById(todoId);
        if (!isTodoExist) {
            return res.status(404).json({ message: "Güncellenecek Todo Bulunamadı!" });
        }

        // Güncellenecek alanları belirle
        const updatedFields: any = {};
        if (title !== undefined && title.trim() !== "") updatedFields.title = title;
        if (completed !== undefined) updatedFields.completed = completed;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: "Güncellenecek bir alan belirtilmelidir!" });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedFields, { new: true });
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.status(500).json({ message: "Güncelleme başarısız!" });
    }
});


//Delete Done Tasks
router.delete("/completed", async (req: any, res: any) => {
    try {
        //completed: true olan tüm todoları siliyoruz
        const deletedTodos = await Todo.deleteMany({ completed: true });

        if (deletedTodos.deletedCount === 0) {
            return res.status(404).json({ message: "Tamamlanmış todo bulunamadı.!" });
        }
        res.status(204).json({
            message: "Tamamlanmış tüm todolar başarıyla silindi!",
            deletedCount: deletedTodos.deletedCount
        })

    } catch (error) {
        res.status(500).json({ message: "Tamamlanmış todoları silme başarısız!" });
    }
})

//Delete All Todo
router.delete("/all", async (req: any, res: any) => {
    try {
        const deletedTodos = await Todo.deleteMany({});
        if (deletedTodos.deletedCount === 0) {
            return res.status(404).json({ message: "Silinecek todo bulunamadı !" });
        }
        res.status(204).json({ message: "Tüm todolar başarıyla silindi.!" });
    }
    catch (error) {
        res.status(500).json({ message: "Tüm todoları silme başarısız!" });
    }
});

//Delete Todo By Id
router.delete("/:id", async (req: any, res: any) => {
    try {
        const todoId = new mongoose.Types.ObjectId(req.params.id);
        const isTodoExist = await Todo.findById(todoId);
        if (!isTodoExist) {
            return res.status(404).json({ message: "Silinecek Todo Bulunamadı.!" });
        }
        //Todo Bulunduysa sil
        await Todo.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: "Todo başarıyla silindi!" });

    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).json({ message: "Silme Başarısız !" });
    }
})

export default router;




