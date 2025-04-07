import type { Context } from 'hono';
import Component from '../models/componentModel.js';
import { Hono } from 'hono';
import mongoose from 'mongoose';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream } from 'node:fs';

// Modifier le chemin pour utiliser un dossier dans /app au lieu de la racine
const uploadsDir = '/app/uploads';

// Assurer que le dossier d'uploads existe
try {
    if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
    }
} catch (err : any) {
    console.error(`Erreur lors de la création du dossier uploads: ${err.message}`);
    // Ne pas faire échouer le démarrage de l'application
    // Le dossier sera créé à la volée lors des requêtes si possible
}

// Fonction pour récupérer tous les composants
export const getComponents = async (c: Context) => {
    try {
        const components = await Component.find();
        if (!components || components.length === 0) {
            return c.json({ message: 'Aucun composant trouvé' },);
        }
        return c.json(components);
    } catch (error) {
        return c.json({ error: 'Erreur lors de la récupération des composants' }, 500);
    }
};

// Fonction pour récupérer un composant par son ID
export const getComponent = async (c: Context) => {
    const { id } = c.req.param();
    try {
        const component = await Component.findById(id);
        if (!component) {
            return c.json({ error: 'Composant non trouvé' }, 404);
        }
        return c.json(component);
    } catch (error) {
        return c.json({ error: 'Erreur lors de la récupération du composant' }, 500);
    }
}

// Fonction pour créer un nouveau composant
export const createComponent = async (c: Context) => {
    try {
        const formData = await c.req.formData();

        // Récupération des champs de formulaire
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const version = formData.get('version') as string;
        const category = formData.get('category') as string;
        const tagsString = formData.get('tags') as string;
        const documentation = formData.get('documentation') as string;
        const componentFile = formData.get('componentFile') as File;

        // Vérification des champs obligatoires
        if (!name || !description || !version || !componentFile) {
            return c.json({ error: 'Tous les champs obligatoires doivent être remplis' }, 400);
        }

        // Traitement des tags (séparés par virgules)
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

        // Générer un nom de fichier unique avec timestamp
        const timestamp = Date.now();
        const safeFileName = componentFile.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const fileName = `${timestamp}-${safeFileName}`;
        const filePath = join(uploadsDir, fileName);

        // Enregistrer le fichier sur le serveur
        try {
            // Lire le contenu du fichier
            const arrayBuffer = await componentFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Écrire le fichier sur le disque - créer les dossiers parents si nécessaire
            await mkdir(dirname(filePath), { recursive: true });
            await writeFile(filePath, buffer);

            console.log(`Fichier enregistré dans: ${filePath}`);
        } catch (fileError) {
            console.error('Erreur lors de l\'enregistrement du fichier:', fileError);
            return c.json({ error: 'Erreur lors de l\'enregistrement du fichier' }, 500);
        }

        // URL de téléchargement via nginx (utiliser le nom du fichier simple)
        const downloadUrl = `https://localhost/api/components/download/${fileName}`;

        // Créer et sauvegarder le composant
        const component = new Component({
            name,
            description,
            version,
            author: 'Utilisateur courant', // À remplacer par l'ID de l'utilisateur authentifié
            tags,
            downloadUrl,
            documentation,
            category
        });

        await component.save();
        return c.json(component, 201);
    } catch (error) {
        console.error('Erreur création composant:', error);
        return c.json({ error: 'Erreur lors de la création du composant' }, 500);
    }
}

// Fonction pour mettre à jour un composant existant
export const editComponent = async (c: Context) => {
    const { id } = c.req.param();
    const {
        name,
        description,
        version,
        author,
        tags,
        downloadUrl,
        documentation,
        category
    } = await c.req.json();

    try {
        const component = await Component.findByIdAndUpdate(
            id,
            {
                name,
                description,
                version,
                author,
                tags,
                downloadUrl,
                documentation,
                category
            },
            { new: true }
        );
        if (!component) {
            return c.json({ error: 'Composant non trouvé' }, 404);
        }
        return c.json(component);
    } catch (error) {
        return c.json({ error: 'Erreur lors de la mise à jour du composant' }, 500);
    }
}

// Fonction pour supprimer un composant
export const deleteComponent = async (c: Context) => {
    const { id } = c.req.param();
    try {
        const component = await Component.findByIdAndDelete(id);
        if (!component) {
            return c.json({ error: 'Composant non trouvé' }, 404);
        }
        return c.json({ message: 'Composant supprimé avec succès' });
    } catch (error) {
        return c.json({ error: 'Erreur lors de la suppression du composant' }, 500);
    }
}

// Fonction pour rechercher des composants par nom, description ou tags
export const searchComponents = async (c: Context) => {
    const { query } = c.req.query();
    try {
        const components = await Component.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
        });
        return c.json(components);
    } catch (error) {
        return c.json({ error: 'Erreur lors de la recherche des composants' }, 500);
    }
}

// Fonction pour télécharger un fichier par son nom
export const downloadFile = async (c: Context) => {
    try {
        const fileName = c.req.param('fileName');
        const filePath = join(uploadsDir, fileName);
        
        console.log(`Tentative d'accès au fichier: ${filePath}`);
        
        if (!existsSync(filePath)) {
            console.error(`Fichier non trouvé: ${filePath}`);
            return c.json({ error: 'Fichier non trouvé' }, 404);
        }
        
        // Lire le fichier et le renvoyer en réponse
        const fileContent = await readFile(filePath);
        return c.body(fileContent, {
            headers: {
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Type': 'application/octet-stream'
            }
        });
    } catch (error) {
        console.error(`Erreur lors du téléchargement: ${error}`);
        return c.json({ error: 'Erreur lors du téléchargement du fichier' }, 500);
    }
};