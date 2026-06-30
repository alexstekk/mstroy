import type { Item, ItemId } from './types.ts';

export class TreeStore {
    constructor(itemsArr: Item[]) {
        // нет мутациям, создаем локальную копию.
        this._items = [...itemsArr];
        // Словари (hash map) нужны для быстрого доступа O(1).
        // Map - чтобы не было свистопляски с TS по поводу типов id,
        this._itemsById = new Map<ItemId, Item>();
        this._childrensById = new Map<ItemId, Set<ItemId>>();

        this._init(this._items);
        console.log('this._items', this._items);
        console.log('this._itemsById', this._itemsById);
        console.log('this._childrensById', this._childrensById);
    }

    getAll(): Item[] {
        // Должен возвращать изначальный массив элементов.
        return [...this._items]; // Можно возвращать и this._items, но для безопасности лучше верну копию.
    }

    getItem(id: ItemId): Item | null {
        // Принимает id элемента и возвращает сам объект элемента.
        // null - чтобы отчетливо видеть, что элемента нет. Если будет undefined, то возможно где-то что-то пошло не так.
        const maybeItem = this._itemsById.get(id) ?? null;
        return maybeItem;
    }

    getChildren(id: ItemId): Item[] {
        // Принимает id элемента и возвращает массив элементов,
        // являющихся дочерними для того элемента, чей id получен в аргументе.
        // Если у элемента нет дочерних, то должен возвращаться пустой массив.

        const childrenIds = this._childrensById.get(id);
        if (!childrenIds) return [];
        const result: Item[] = [];
        for (const id of childrenIds) {
            const children = this._itemsById.get(id);
            if (children) {
                result.push(children);
            }
        }
        return result;
    }

    getAllChildren(id: ItemId): Item[] {
        // Принимает id элемента и возвращает массив элементов,
        // являющихся прямыми дочерними элементами того, чей id получен в аргументе +
        // если у них в свою очередь есть еще дочерние элементы, они все тоже будут
        // включены в результат и так до самого глубокого уровня.

        if (!id) {
            throw new Error('Неверные данные, ожидается id');
        }

        // Необходимо обойти дерево элементов. Подойдет обход в глубину со стеком и массивом результата.
        const result: Item[] = [];
        const stack: ItemId[] = [id];

        while (stack.length) {
            const currentId = stack.pop();
            if (currentId) {
                const childrenIds = this._childrensById.get(currentId);

                if (childrenIds) {
                    for (const childrenId of childrenIds) {
                        const child = this._itemsById.get(childrenId);

                        if (child) {
                            result.push(child);
                            stack.push(childrenId);
                        }
                    }
                }
            }
        }

        return result;
    }

    getAllParents(id: ItemId) {
        // Принимает id элемента и возвращает массив из цепочки
        // родительских элементов, начиная от самого элемента, чей id был передан в
        // аргументе и до корневого элемента, т.е. должен получиться путь элемента
        // наверх дерева через цепочку родителей к корню дерева. В результате
        // getAllParents ПОРЯДОК ЭЛЕМЕНТОВ ВАЖЕН!
    }

    addItem(item: Item) {
        // Принимает объект нового элемента и добавляет его в общую структуру хранилища.
    }

    removeItem(id: ItemId) {
        // Принимает id элемента и удаляет соответствующий элемент и все его дочерние элементы из хранилища.
    }

    updateItem(item: Item) {
        // Принимает объект обновленного айтема и актуализирует этот айтем в хранилище.
    }

    _init(items: Item[]) {
        if (!Array.isArray(items)) {
            throw new Error('Неверные данные, ожидается массив');
        }
        // O(n), обойдем исходный массив один раз и создадим нужные словари.

        // [
        //   { id: 1, parent: null, label: 'Айтем 1' },
        //   { id: '91064cee', parent: 1, label: 'Айтем 2' },
        //   { id: 3, parent: 1, label: 'Айтем 3' },
        //   { id: 4, parent: '91064cee', label: 'Айтем 4' },
        //   { id: 5, parent: '91064cee', label: 'Айтем 5' },
        //   { id: 6, parent: '91064cee', label: 'Айтем 6' },
        //   { id: 7, parent: 4, label: 'Айтем 7' },
        //   { id: 8, parent: 4, label: 'Айтем 8' },
        // ]

        for (const item of items) {
            this._itemsById.set(item.id, item);
            const parent = item.parent;
            if (parent) {
                if (!this._childrensById.has(parent)) {
                    this._childrensById.set(parent, new Set());
                }
                this._childrensById.get(parent)?.add(item.id);
            }
        }
    }

    _items: Item[];
    _itemsById: Map<ItemId, Item>;
    _childrensById: Map<ItemId, Set<ItemId>>;
}
