import { type Category, TransactionType } from "@prisma/client";
import prisma from "../config/prisma";


type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;



const globalCategories: GlobalCategoryInput[] = [
    // Despesas
    { name: "Alimentação", color: "#FF5733", type: TransactionType.expense },
    { name: "Transporte", color: "#33A8FF", type: TransactionType.expense },
    { name: "Moradia", color: "#33FF57", type: TransactionType.expense },
    { name: "Saúde", color: "#F033FF", type: TransactionType.expense },
    { name: "Educação", color: "#FF3366", type: TransactionType.expense },
    { name: "Lazer", color: "#FFBA33", type: TransactionType.expense },
    { name: "Compras", color: "#33FFF6", type: TransactionType.expense },
    { name: "Outros", color: "#B033FF", type: TransactionType.expense },

    // Receitas
    { name: "Salário", color: "#33FF57", type: TransactionType.income },
    { name: "Freelance", color: "#33A8FF", type: TransactionType.income },
    { name: "Investimentos", color: "#FFBA33", type: TransactionType.income },
    { name: "Outros", color: "#B033FF", type: TransactionType.income },
];

export const initializeGlobalCategories = async (
    userId: string
): Promise<Category[]> => {


    // ✅ Se já existe qualquer categoria do usuário, não inicializa de novo
    const alreadyHasCategories = await prisma.category.findFirst({
        where: { userId },
        select: { id: true },
    });

    if (alreadyHasCategories) {
        return [];
    }

    const createdCategories: Category[] = [];

    for (const category of globalCategories) {
        try {
            const existing = await prisma.category.findFirst({
                where: {
                    userId,
                    name: category.name,
                    type: category.type,
                },
            });

            if (!existing) {
                const newCategory = await prisma.category.create({
                    data: {
                        userId,
                        ...category,
                    }
                });
                console.log(`✅ Criada: ${newCategory.name}`);
                createdCategories.push(newCategory);

            } else {
                createdCategories.push(existing);
            }

        } catch (err) {
            console.error(`🚨 Erro ao criar categoria "${category.name}"`, err);
        }

    }
    // ✅ LOGA APENAS SE CRIOU ALGO
    if (createdCategories.length > 0) {
        console.log("✅ Todas as categorias inicializada")
    }
    return createdCategories;

};