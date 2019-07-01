import {
    fromEvent,Observable, of
} from 'rxjs';
import {
    debounceTime, distinctUntilChanged,
    filter,
    pluck,
    switchMap
} from 'rxjs/operators';
import '../style.css';

export interface IShowItem{
    name: string;
    watchers: number;
    html_url: string;
    language: string;
    owner: {[key: string]: string};

    [key: string]: any;
}

const find = getCatalogs(fromEvent(document.getElementById('find') as HTMLInputElement, 'keydown'))
    .subscribe(catalogs => {
        setItems(catalogs.items);
    })



function getCatalogs(source$: Observable<any>): Observable<any> {
    return source$
        .pipe(
            debounceTime(500),
            pluck('target', 'value'),
            filter(v => {
                if(!v) clearItems();
                return !!v
            }),
            distinctUntilChanged(),
            switchMap((v) => getFromHttp(v)
                .catch(() => of([])))
        )
}

function getFromHttp(v: string): Promise<any> {
    return fetch(`https://api.github.com/search/repositories?q=${v}`)
        .then((res: Response) => res.json());
}

function clearItems() {
    const element: HTMLInputElement = document.getElementById('result') as HTMLInputElement;
    element.innerHTML = '<h1>Not found :(</h1>';
}

function setItems(items: IShowItem[]) {
    clearItems();
    const element: HTMLInputElement = document.getElementById('result') as HTMLInputElement;
    let html: string = `<div class="row">
                            <div class="cell">name</div>
                            <div class="cell">watchers</div>
                            <div class="cell">language</div>
                            <div class="cell">owner</div>
                            <div class="cell">link</div>
                         </div>`;

    items.forEach((item: any) => {
        html += `<div class="row">
                    <div class="cell"><b>${item.name}</b></div>
                    <div class="cell">${item.watchers}</div>
                    <div class="cell">${item.language}</div>
                    <div class="cell"><img src="${item.owner.avatar_url}"></img>${item.owner.login}</div>
                    <div class="cell"><a href='${item.html_url}' target="_blank">link</a></div>
                 </div>`;
    });
    element.innerHTML = html;
    return;
}



