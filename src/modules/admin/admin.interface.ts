import { UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";

export interface IUsersQuery extends UserWhereInput {
    limit?: string
    page?: string
}

export interface IUpdateUserStatus {
    status: UserStatus;
}