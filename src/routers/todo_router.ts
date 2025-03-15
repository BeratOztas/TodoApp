import express from "express";
import Todo from "../models/todo";
import mongoose from "mongoose";
const router = express.Router();

//Get (Tüm Todo'ları Getir)
router.get("/", async (req: any, res: any) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Sunucu Hatası Oluştu!" })
    }
});

//Post (Yeni Todo Ekle)
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
//Put/Update (Todo Güncelle)
router.put("/:id", async (req: any, res: any) => {
    try {
        const { title, completed } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Todo Boş olamaz" });
        }
        const todoId = new mongoose.Types.ObjectId(req.params.id);
        const isTodoExist = await Todo.findById(req.params.id);
        console.log(isTodoExist); // Burada konsola yazdırarak sonucu kontrol edebilirsiniz.
        if (!isTodoExist) {
            return res.status(404).json({ message: "Güncellenecek Todo Bulunamadı !" });
        }
        //findByIdAndUpdate save() yapmamıza gerek yok
        //Otamatik olarak db'de kendisi günceller.
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, completed },
            { new: true }
        );
        res.status(201).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Güncelleme başarısız" });
    }
})


//Delete Done Tasks(Tamamlanmış Todoları sil)
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

//Delete All Todo(Bütün Todo'ları Sil)
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

//Delete Todo (Bir Todo Sil)
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




