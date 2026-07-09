import { UserStatus } from "../../../generated/prisma/enums";
import { RentalRequestWhereInput, UserWhereInput } from "../../../generated/prisma/models";

export interface IUsersQuery extends UserWhereInput {
    limit?: string
    page?: string
}

export interface IUpdateUserStatus {
    status: UserStatus;
}

export interface IRentalsQuery extends RentalRequestWhereInput {
    limit?: string,
    page?: string,
    searchTerm? : string
}