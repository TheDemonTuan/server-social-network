import { PrismaService } from "@/prisma/prisma.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class DBPostCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUnique(params: { where: Prisma.PostCommentWhereUniqueInput; select?: Prisma.PostCommentSelect }) {
    try {
      return await this.prismaService.postComment.findUnique({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching post comment", {
        cause: error,
      });
    }
  }

  public async findFirst(params: {
    skip?: number;
    cursor?: Prisma.PostCommentWhereUniqueInput;
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput;
  }) {
    try {
      return await this.prismaService.postComment.findFirst({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching post comment", {
        cause: error,
      });
    }
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostCommentWhereUniqueInput;
    include?: Prisma.PostCommentInclude;
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput;
  }) {
    try {
      return await this.prismaService.postComment.findMany({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error fetching post comments", {
        cause: error,
      });
    }
  }

  async insert(data: Prisma.PostCommentCreateInput) {
    try {
      return await this.prismaService.postComment.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error inserting post comment", {
        cause: error,
      });
    }
  }

  async delete(where: Prisma.PostCommentWhereUniqueInput) {
    try {
      return await this.prismaService.postComment.delete({
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error delete post comment", {
        cause: error,
      });
    }
  }

  async count(params: {
    where?: Prisma.PostCommentWhereInput;
    orderBy?: Prisma.PostCommentOrderByWithRelationInput;
    cursor?: Prisma.PostCommentWhereUniqueInput;
    take?: number;
    skip?: number;
  }) {
    try {
      return await this.prismaService.postComment.count({
        ...params,
      });
    } catch (error) {
      throw new InternalServerErrorException("Error counting post comment", {
        cause: error,
      });
    }
  }
}
