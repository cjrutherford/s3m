import * as fs from 'fs/promises';
import * as path from 'path';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetService {
    private readonly assetPath: string;
    constructor(private readonly config: ConfigService) {
        this.assetPath = this.config.get<string>('ASSET_PATH') || path.join(__dirname, '..', 'assets');
    }

    async saveAsset(fileName: string, content: Buffer): Promise<string> {
        const filePath = path.join(this.assetPath, fileName);
        await fs.writeFile(filePath, content);
        return fileName;
    }

    async readAsset(fileName: string): Promise<Buffer> {
        const filePath = path.join(this.assetPath, fileName);
        try {
            return await fs.readFile(filePath);
        } catch (error) {
            throw new Error(error.message);
        }   
    }

    async deleteAsset(fileName: string): Promise<void> {
        const filePath = path.join(this.assetPath, fileName);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw new Error(`Failed to delete asset: ${fileName}`);
        }   
    }
}
