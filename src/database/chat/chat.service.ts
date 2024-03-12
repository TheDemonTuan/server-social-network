import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class DBChatService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUnique(params: { where: Prisma.ChatWhereUniqueInput; select?: Prisma.ChatSelect; include?: Prisma.ChatInclude }) {
    try {
      return await this.prismaService.chat.findUnique({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching chat", {
        cause: error,
      });
    }
  }

  public async findFirst(params: {
    skip?: number;
    cursor?: Prisma.ChatWhereUniqueInput;
    where?: Prisma.ChatWhereInput;
    orderBy?: Prisma.ChatOrderByWithRelationInput;
  }) {
    try {
      return await this.prismaService.chat.findFirst({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching chat", {
        cause: error,
      });
    }
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatWhereUniqueInput;
    include?: Prisma.ChatInclude;
    where?: Prisma.ChatWhereInput;
    orderBy?: Prisma.ChatOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    try {
      return await this.prismaService.chat.findMany({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching chats", {
        cause: error,
      });
    }
  }

  async insert(data: Prisma.ChatCreateInput) {
    try {
      return await this.prismaService.chat.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error creating chat", {
        cause: error,
      });
    }
  }

  async update(params: { where: Prisma.ChatWhereUniqueInput; data: Prisma.ChatUpdateInput }) {
    try {
      return await this.prismaService.chat.update({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error updating chat", {
        cause: error,
      });
    }
  }

  async delete(data: Prisma.ChatWhereUniqueInput) {
    try {
      return await this.prismaService.chat.delete({
        where: data,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error deleting chat", {
        cause: error,
      });
    }
  }
}
