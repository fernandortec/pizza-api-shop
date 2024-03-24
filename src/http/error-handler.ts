import type { ResourceAlreadyExistsError } from "@/use-cases/errors/resource-already-exists";
import type { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import type { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import type { ErrorHandler } from "elysia";

export const errorHandler: ErrorHandler<{
	readonly ALREADY_EXISTS: ResourceAlreadyExistsError;
	readonly UNAUTHORIZED: UnauthorizedError;
	readonly NOT_FOUND: ResourceNotFoundError;
}> = ({ code, error, set }) => {
	switch (code) {
		case "VALIDATION": {
			set.status = error.status;
			return error.toResponse();
		}

		default: {
			set.status = 500;

			return new Response(null, { status: 500 });
		}
	}
};
