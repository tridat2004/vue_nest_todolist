import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';


@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>){}

    async findAll() : Promise<Task[]>{
        return this.taskModel.find().sort({ createdAt: -1 }).exec();
    }
    async create(createTaskDto: CreateTaskDto) : Promise<Task>{
        const createdTask = new this.taskModel(createTaskDto);
        return createdTask.save();
    }
    async update(id: string, updateTaskDto: UpdateTaskDto) : Promise<Task>{
        const existingTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {new : true}).exec();
        if(!existingTask){
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return existingTask;   
    }
    async remove(id: string): Promise<boolean> {
        const result = await this.taskModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

}