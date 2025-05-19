import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject } from 'rxjs';
export interface Lista {
    id: number;
    id_user: number;
    nome: 'liked' | 'favourites' | 'watch later';
    items: string[];
}

export interface Reviews {
    id: number;
    id_user: number;
    title: string;
    body: string;
    id_item: string | null;
}

export interface UserInfo {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface BD {
    listas: Lista[];
    userinfo: UserInfo[];
    reviews: Reviews[];
}

@Injectable({
    providedIn: 'root'
})
export class RepoService {
    private bd: BD = { listas: [], userinfo: [],reviews: []};
    private storageInitialized = false;
    private currentUser$ = new BehaviorSubject<UserInfo | null>(null);
    
    constructor(private storage: Storage) {
        this.init();
    }

    private async init(): Promise<void> {
        if (this.storageInitialized) return;
        
        await this.storage.defineDriver(CordovaSQLiteDriver);
        await this.storage.create();
        const storedData = await this.storage.get('bd');
        if (storedData) this.bd = storedData;
        
        this.storageInitialized = true;
    }

    private async saveToStorage(): Promise<void> {
        if (!this.storageInitialized) await this.init();
        await this.storage.set('bd', this.bd);
    }

    private getCurrentTimestamp(): number {
        return Date.now();
    }

    async insertUser(user: { name:string,email: string, password: string }): Promise<{ success: boolean, userId?: number }> {
        try {
            await this.init();
            
            // Confirma se email ja existe
            for (const existingUser of this.bd.userinfo) {
                if (existingUser.email === user.email) {
                    return { success: false };
                }
            }

            // Cria novo user
            const newUser: UserInfo = {
                id: this.getCurrentTimestamp(),
                name: user.name,
                email: user.email,
                password: user.password
            };
            //Adiciona novo user ao array
            this.bd.userinfo.push(newUser);
            //Cria listas default do user
            await this.createDefaultLists(newUser.id);
            //Grava dados
            await this.saveToStorage();
            
            return { success: true, userId: newUser.id };
        } catch (error) {
            console.error('Error inserting user:', error);
            return { success: false };
        }
    }
    
    //Busca user por email
    getUserByEmail(email: string): UserInfo | undefined {
        for (const user of this.bd.userinfo) {
            if (user.email === email) {
                return user;
            }
        }
        return undefined;
    }

    //Cria listas defaults(privado para se usado em outra func local)
    private async createDefaultLists(userId: number): Promise<void> {
        const listNames = ['liked', 'favourites', 'watch later'];
        for (const nome of listNames) {
            const newList: Lista = {
                id: this.getCurrentTimestamp(),
                id_user: userId,
                nome: nome as 'liked' | 'favourites' | 'watch later',
                items: []  // Initialize as empty array
            };
            this.bd.listas.push(newList);
        }
        await this.saveToStorage();
    }

    //Adiciona ou remove item á lista de liked do user
    async toggleLikedItem(userId: number, itemId: string): Promise<boolean> {
    return this.toggleListItem(userId, 'liked', itemId);
    }

    //Adiciona ou remove item á lista de favourite do user
    async toggleFavouriteItem(userId: number, itemId: string): Promise<boolean> {
        return this.toggleListItem(userId, 'favourites', itemId);
    }

    //Adiciona ou remove item á lista de watchlater do user
    async toggleWatchLaterItem(userId: number, itemId: string): Promise<boolean> {
        return this.toggleListItem(userId, 'watch later', itemId);
    }

    
    async toggleListItem(
    userId: number,
    listName: 'liked' | 'favourites' | 'watch later',
    itemId: string
    ): Promise<boolean> {
        try {
            await this.init();
            
            const list = this.bd.listas.find(
                l => l.id_user === userId && l.nome === listName
            );

            if (!list) {
                console.error(`List ${listName} not found for user ${userId}`);
                return false;
            }

            // Adiciona a lista se nao existir e remove se existir
            const itemIndex = list.items.indexOf(itemId);
            if (itemIndex === -1) {
                list.items.push(itemId);  // Adiciona a lista
            } else {
                list.items.splice(itemIndex, 1);  // Tira da lista
            }

            //Salva os dados
            await this.saveToStorage();
            return true;
        } catch (error) {
            console.error(`Error toggling item in ${listName}:`, error);
            return false;
        }
    }

    //Devolve lista liked do user pedido user
    getLikedList(userId: number): Lista | undefined {
    return this.bd.listas.find(
        list => list.id_user === userId && list.nome === 'liked'
    );
    }

    //Devolve lista favourites do user pedido
    getFavouritesList(userId: number): Lista | undefined {
        return this.bd.listas.find(
            list => list.id_user === userId && list.nome === 'favourites'
        );
    }

    //Devolve lista watchlater do user pedido
    getWatchLaterList(userId: number): Lista | undefined {
        return this.bd.listas.find(
            list => list.id_user === userId && list.nome === 'watch later'
        );
    }

    getAllUserLists(userId: number): Lista[] {
        const userLists: Lista[] = [];
        for (const list of this.bd.listas) {
            if (list.id_user === userId) {
                userLists.push(list);
            }
        }
        return userLists;
    }

    // Define user atualmente loggado
    setCurrentUser(user: UserInfo | null) {
        this.currentUser$.next(user);
    }

    // Devolve user loggado atualmente
    getCurrentUser$() {
    return this.currentUser$.asObservable();
  }

    // Limpa variavel de user loggado atualmente
    clearCurrentUser(): void {
        this.setCurrentUser(null);
    }

    //Verifica se email inserido existe
    async doesEmailExistAsync(email: string): Promise<boolean> {
        await this.init(); // Ensure storage is loaded
        return this.bd.userinfo.some(user => user.email === email);
    }
    
    
}