import { Controller, Get, Param, Res } from '@nestjs/common';
import { AssetService } from './asset.service';
import { Response } from 'express';

@Controller('asset')
export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    @Get(':assetUrl')
    async getAsset(@Param('assetUrl') assetUrl: string, @Res() response: Response): Promise<void> {
        const fileData = await this.assetService.readAsset(assetUrl);
        response.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${assetUrl}"`
        });
        response.send(fileData);
    }
}
