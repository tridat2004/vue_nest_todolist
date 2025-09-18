import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { Types } from 'mongoose';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Get()
    async findAll(): Promise<Task[]> {
        return this.taskService.findAll();
    }

    @Post()
    async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.create(createTaskDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        this.validateObjectId(id);
        const task = await this.taskService.update(id, updateTaskDto);
        if (!task) {
            throw new NotFoundException(`Không tìm thấy task với ID ${id}`);
        }
        return task;
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        this.validateObjectId(id);
        await this.taskService.remove(id); // ✅ Đã thêm await
        return { message: `Xóa task với ID ${id} thành công` };
    }

    private validateObjectId(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID task không hợp lệ');
        }
    }
}