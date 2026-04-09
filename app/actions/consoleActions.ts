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

// ELIMINAR
export async function deleteConsole(id: number) {
    await prisma.console.delete({
        where: { id: Number(id) },
    });

    revalidatePath("/consoles");
}

// EDITAR
export async function updateConsole(id: number, formData: FormData) {
    const file = formData.get("image") as File;

    let fileName: string | undefined = undefined;

    // SI SUBEN NUEVA IMAGEN
    if (file && file.size > 0) {
        const newFileName = `${Date.now()}-${file.name}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(process.cwd(), "public/imgs", newFileName);

        fs.writeFileSync(filePath, buffer);

        fileName = newFileName;
    }

    // OBTENER IMAGEN ACTUAL SI NO SUBEN NADA
    const existingConsole = await prisma.console.findUnique({
        where: { id: Number(id) },
    });

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