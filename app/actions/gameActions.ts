"use server";

import { PrismaClient } from "@/src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
});

// Función auxiliar para borrar archivo (para no repetir código)
const deleteFile = (fileName: string | undefined | null) => {
    if (fileName) {
        const filePath = path.join(process.cwd(), "public/imgs", fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

export async function createGame(formData: FormData) {
    const file = formData.get("cover") as File;

    if (!file || file.size === 0) {
        throw new Error("Imagen requerida");
    }

    const fileName = `${Date.now()}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public/imgs", fileName);

    if (!fs.existsSync(path.join(process.cwd(), "public/imgs"))) {
        fs.mkdirSync(path.join(process.cwd(), "public/imgs"), { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    await prisma.games.create({
        data: {
            title: formData.get("title") as string,
            developer: formData.get("developer") as string,
            price: Number(formData.get("price")),
            genre: formData.get("genre") as string,
            description: formData.get("description") as string || "Sin descripción",
            cover: fileName,
            console_id: Number(formData.get("console_id")),
            releaseDate: new Date(formData.get("releaseDate") as string),
        },
    });

    revalidatePath("/games");
    redirect("/games");
}

// ELIMINAR (CORREGIDO)
export async function deleteGame(id: number) {
    // 1. Obtener el juego para saber el nombre de la imagen antes de borrarlo
    const game = await prisma.games.findUnique({
        where: { id: Number(id) },
    });

    if (game) {
        // 2. Borrar el archivo físico
        deleteFile(game.cover);

        // 3. Borrar de la base de datos
        await prisma.games.delete({
            where: { id: Number(id) },
        });
    }

    revalidatePath("/games");
}

// EDITAR (CORREGIDO)
export async function updateGame(id: number, formData: FormData) {
    const file = formData.get("cover") as File;
    
    // Obtener datos actuales del juego
    const existingGame = await prisma.games.findUnique({
        where: { id: Number(id) },
    });

    let fileName: string | undefined = undefined;

    // SI SUBEN NUEVA IMAGEN
    if (file && file.size > 0) {
        // 1. Borrar la imagen ANTERIOR para no dejar basura
        deleteFile(existingGame?.cover);

        // 2. Guardar la nueva
        const newFileName = `${Date.now()}-${file.name}`;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(process.cwd(), "public/imgs", newFileName);
        fs.writeFileSync(filePath, buffer);

        fileName = newFileName;
    }

    await prisma.games.update({
        where: { id: Number(id) },
        data: {
            title: formData.get("title") as string,
            developer: formData.get("developer") as string,
            price: Number(formData.get("price")),
            genre: formData.get("genre") as string,
            description: formData.get("description") as string || existingGame?.description,
            console_id: Number(formData.get("console_id")),
            releaseDate: new Date(formData.get("releaseDate") as string),
            cover: fileName ?? existingGame?.cover, // Si no hay nueva, mantiene la anterior
        },
    });

    revalidatePath("/games");
    redirect("/games");
}