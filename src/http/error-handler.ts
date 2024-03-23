import type { EntityAlreadyExistsError } from "@/use-cases/errors/resource-already-exists";
import type { UnauthorizedError } from "@/use-cases/errors/unauthorized-error";
import type { ErrorHandler } from "elysia";

export const errorHandler: ErrorHandler<{
	readonly ALREADY_EXISTS: EntityAlreadyExistsError;
	readonly UNATHORIZED: UnauthorizedError;
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
