import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export default class SaltEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    userId: string;
    
    @Column()
    salt: string;
}

export class SaltDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    salt: string;
}