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

// Función auxiliar para borrar archivos físicos
const deleteFile = (fileName: string | undefined | null) => {
    if (fileName) {
        const filePath = path.join(process.cwd(), "public/imgs", fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

export async function createConsole(formData: FormData) {
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
        throw new Error("Imagen requerida");
    }

    const fileName = `${Date.now()}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public/imgs", fileName);

    // Crear carpeta si no existe
    if (!fs.existsSync(path.join(process.cwd(), "public/imgs"))) {
        fs.mkdirSync(path.join(process.cwd(), "public/imgs"), { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    await prisma.console.create({
        data: {
            name: formData.get("name") as string,
            manufacturer: formData.get("manufacturer") as string,
            description: formData.get("description") as string || "Sin descripción",
            image: fileName,
            releaseDate: new Date(formData.get("releaseDate") as string),
        },
    });

    revalidatePath("/consoles");
    redirect("/consoles");
}

// ELIMINAR (CORREGIDO)
export async function deleteConsole(id: number) {
    // 1. Obtener la consola para saber el nombre de la imagen
    const existingConsole = await prisma.console.findUnique({
        where: { id: Number(id) },
    });

    if (existingConsole) {
        // 2. Borrar el archivo físico de public/imgs
        deleteFile(existingConsole.image);

        // 3. Borrar de la base de datos
        await prisma.console.delete({
            where: { id: Number(id) },
        });
    }

    revalidatePath("/consoles");
}

// EDITAR (CORREGIDO)
export async function updateConsole(id: number, formData: FormData) {
    const file = formData.get("image") as File;
    
    // Obtener datos actuales
    const existingConsole = await prisma.console.findUnique({
        where: { id: Number(id) },
    });

    let fileName: string | undefined = undefined;

    // SI SUBEN NUEVA IMAGEN
    if (file && file.size > 0) {
        // 1. Borrar la imagen anterior para no dejar basura
        deleteFile(existingConsole?.image);

        // 2. Guardar la nueva imagen
        const newFileName = `${Date.now()}-${file.name}`;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(process.cwd(), "public/imgs", newFileName);
        
        fs.writeFileSync(filePath, buffer);
        fileName = newFileName;
    }

    await prisma.console.update({
        where: { id: Number(id) },
        data: {
            name: formData.get("name") as string,
            manufacturer: formData.get("manufacturer") as string,
            description: formData.get("description") as string || existingConsole?.description,
            releaseDate: new Date(formData.get("releaseDate") as string),
            image: fileName ?? existingConsole?.image,
        },
    });

    revalidatePath("/consoles");
    redirect("/consoles");
}