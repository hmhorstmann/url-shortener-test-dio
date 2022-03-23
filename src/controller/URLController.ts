import { Request, Response } from "express";
import shortId from 'shortid';
import { config } from "../config/Constants";
import { URLModel } from "database/model/URL";

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void> {
        // Verificar se a url existe
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
            res.json(url)
            return
        }
        //     // Criar o hash para essa url
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        // res.json({ originURL, hash, shortURL })
        //     // Salvar a URL no banco
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        res.json(newURL)
        //     // Retornar a ulr q foi salva
    }

    public async redirect(req: Request, res: Response): Promise<void> {
        //     // Pegar o hash da url
        const { hash } = req.params
        const url = await URLModel.findOne({ hash })
        //     // Encontrar ulr original pelo hash

        if (url) {
            res.redirect(url.originURL)
            return
        }
        
        // const url = {
            //     originURL: "https://cloud.mongodb.com/v2/623a4ebec3be21643293b448#clusters",
            //     hash: "4yaEIHbhX",
            //     shortURL: "http://localhost:5000/4yaEIHbhX",
            // }
            // Redirecionar para a url original a partir do q foi encontrado no DB
            // res.redirect(url.originURL)
                res.status(400).json({ error: "URL not found" })
    }
}