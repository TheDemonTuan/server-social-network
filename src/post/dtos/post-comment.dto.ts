import { IsNotEmpty, IsString } from "class-validator";

export class PostCommentDto {
  @IsString({ message: "Content must be string" })
  @IsNotEmpty({ message: "Content must not be empty" })
  readonly content: string;
}
