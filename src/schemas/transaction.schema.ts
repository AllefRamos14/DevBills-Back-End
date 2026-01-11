import { z } from "zod";
import { ObjectId } from "mongodb";
import { TransactionType } from "@prisma/client";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
    description: z.string().min(1, "Descrição Obrigatória"),
    amount: z.number().positive("Valor deve ser positivo"),
    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
        message: "Data Inválida",
    }),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Inválida",
    }),

    type: z.enum([TransactionType.expense, TransactionType.income], {
        message: "Tipo Inválido",
    }),
});

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z
        .enum([TransactionType.expense, TransactionType.income], {
            message: "Tipo Inválido",
        })
        .optional(),
    categoryId: z
        .string()
        .refine(isValidObjectId, {
            message: "Categoria Inválida",
        })
        .optional(),
});

export const getTransactionSummarySchema = z.object({
    month: z.string({ message: "O mês é obrigatorio" }),
    year: z.string({ message: "O ano é obrigatorio" }),
});

export const getHistoricalTransactionSchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    months: z.coerce.number().min(1).max(12).optional(),
});


export const deleteTransactionSchema = z.object({
    id: z.string().refine(isValidObjectId, {
        message: "Id Inválido",
    })
});
export type GetHistoricalTransactionQuery = z.infer<typeof getHistoricalTransactionSchema>;
export type DeleteTransactionSchema = z.infer<typeof deleteTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSchemaQuery = z.infer<typeof getTransactionSummarySchema>;



































// import { z } from "zod";
// import { ObjectId } from "mongodb";
// import { TransactionType } from "@prisma/client";

// const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

// export const createTransactionSchema = z.object({
//     description: z.string().min(1, "Descrição Obrigatória"),
//     amount: z.number().positive("Valor deve ser positivo"),
//     date: z.coerce.date().refine((d) => !isNaN(d.getTime()), { message: "Data Inválida" }),

//     categoryId: z.string().refine(isValidObjectId, {
//         message: "Categoria Inválida",
//     }),
//     type: z.enum([TransactionType.expense, TransactionType.income], {
//         message: "Data Inválida ",
//     }),
// });

// export const getTransactionsSchema = z.object({
//     month: z.string().optional(),
//     year: z.string().optional(),
//     type: z
//         .enum([TransactionType.expense, TransactionType.income], {
//             message: "Data Inválida ",
//         })
//         .optional(),
//     categoryId: z
//         .string()
//         .refine(isValidObjectId, {
//             message: "Data Inválida ",
//         })
//         .optional(),
// });

// export type getTransactionsQuery = z.infer<typeof getTransactionsSchema>;










// explicação resumida e direta:

// .refine((d) => !isNaN(d.getTime()), { message: "Data Inválida" })

// .refine(): permite criar uma validação extra personalizada sobre o valor que já foi convertido.
// (d) => !isNaN(d.getTime()): verifica se o Date é válido (não é Invalid Date).
// { message: "Data Inválida" }: define a mensagem de erro que será retornada se a validação falhar.

// 💡 Em resumo:

// Depois de usar z.coerce.date() para transformar a string em Date, .refine() garante que a data seja realmente válida e dá a mensagem amigável caso não seja.