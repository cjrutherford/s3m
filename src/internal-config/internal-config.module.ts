import {
    CommentEntity,
    FollowEntity,
    PostEntity,
    SaltEntity,
    TokenEntity,
    UserEntity,
    UserProfileEntity,
    VoteEntity
} from '../database/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DataSource } from 'typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [() => {
                return {
                    DB_HOST: process.env.DB_HOST || 'localhost',
                    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
                    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
                    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
                    DB_DB: process.env.DB_DB || 's3m',
                    APPLICATION_ENCRIPTION_SEED: process.env.APPLICATION_ENCRIPTION_SEED || 'default_seed',
                    ASSET_PATH: process.env.ASSET_PATH || '/assets',
                }
            }]
        }),
        DatabaseModule.register({
            name: 's3m', 
            factory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_NAME'),
                entities: [
                    UserEntity,
                    SaltEntity,
                    TokenEntity,
                    UserProfileEntity,
                    PostEntity,
                    VoteEntity,
                    CommentEntity,
                    FollowEntity
                ],
                synchronize: true,
                logging: false
            })
        })
    ],
    exports: [
        ConfigModule,
        getRepositoryToken(UserEntity),
        getRepositoryToken(TokenEntity),
        getRepositoryToken(SaltEntity),
        getRepositoryToken(UserProfileEntity),
        getRepositoryToken(PostEntity),
        getRepositoryToken(CommentEntity),
        getRepositoryToken(FollowEntity),
        getRepositoryToken(VoteEntity),
    ],
    providers: [
        {
            provide: getRepositoryToken(UserEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(TokenEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(TokenEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(SaltEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(SaltEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(UserProfileEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(UserProfileEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(PostEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(PostEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(CommentEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(CommentEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(FollowEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(FollowEntity),
            inject: ['S3M_CONNECTION'],
        },{
            provide: getRepositoryToken(VoteEntity),
            useFactory: (dataSource: DataSource) => dataSource.getRepository(VoteEntity),
            inject: ['S3M_CONNECTION'],
        }
    ]
})
export class InternalConfigModule { }
