import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class DBFriendService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUnique(params: { where: Prisma.FriendWhereUniqueInput; select?: Prisma.FriendSelect }) {
    try {
      return await this.prismaService.friend.findUnique({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching friend", {
        cause: error,
      });
    }
  }

  public async findFirst(params: {
    skip?: number;
    cursor?: Prisma.FriendWhereUniqueInput;
    where?: Prisma.FriendWhereInput;
    orderBy?: Prisma.FriendOrderByWithRelationInput;
  }) {
    try {
      return await this.prismaService.friend.findFirst({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching friend", {
        cause: error,
      });
    }
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FriendWhereUniqueInput;
    include?: Prisma.FriendInclude;
    where?: Prisma.FriendWhereInput;
    orderBy?: Prisma.FriendOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    try {
      return await this.prismaService.friend.findMany({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching friends", {
        cause: error,
      });
    }
  }

  async insert(data: Prisma.FriendCreateInput) {
    try {
      return await this.prismaService.friend.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error creating friend", {
        cause: error,
      });
    }
  }

  async update(params: { where: Prisma.FriendWhereUniqueInput; data: Prisma.FriendUpdateInput }) {
    try {
      return await this.prismaService.friend.update({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error updating friend", {
        cause: error,
      });
    }
  }

  async delete(data: Prisma.FriendWhereUniqueInput) {
    try {
      return await this.prismaService.friend.delete({
        where: data,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error deleting friend", {
        cause: error,
      });
    }
  }
}
