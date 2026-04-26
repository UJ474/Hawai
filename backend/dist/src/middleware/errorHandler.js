import { Prisma } from "@prisma/client";
export const errorHandler = (err, _req, res, _next) => {
    console.error("Error caught by middleware:", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                const target = err.meta?.target?.join(", ") || "field";
                return res.status(409).json({
                    error: "Unique constraint failed",
                    message: `A record with this ${target} already exists.`,
                });
            }
            case "P2003": {
                const field = err.meta?.field_name || "foreign key";
                return res.status(400).json({
                    error: "Foreign key constraint failed",
                    message: `The provided reference in ${field} does not exist.`,
                });
            }
            case "P2025": {
                return res.status(404).json({
                    error: "Not found",
                    message: err.meta?.cause || "The requested record was not found.",
                });
            }
            default:
                return res.status(400).json({
                    error: "Database error",
                    message: `Prisma error code: ${err.code}`,
                });
        }
    }
    if (err.name === "ZodError" || err instanceof Error && err.constructor.name === "ZodError") {
        return res.status(400).json({
            error: "Validation failed",
            details: err.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        error: err.name || "Error",
        message: message,
    });
};
//# sourceMappingURL=errorHandler.js.map