// Observable + Subscriber  = Subject

import {
    fromEvent, Subject, Observable, of
} from 'rxjs';
import {
    debounceTime, distinct,
    distinctUntilChanged, filter,
    map,
    multicast,
    pluck,
    publish,
    refCount,
    share,
    switchMap,
    take,
    tap
} from 'rxjs/operators';

// interface showItem{
//     name: string,
//     watchers: number,
//     html_url: string,
//     language: string,
//     owner: {[key: string]: string},
//     [key: string]: string
// }

const find = getCatalogs(fromEvent(document.getElementById('find') as HTMLInputElement, 'keydown'))
    .subscribe(catalogs => {
        setItems(catalogs.items || null);
    })



function getCatalogs(source$: Observable<any>, request$?: Observable<any>): Observable<any> {
    return source$
        .pipe(
            debounceTime(300),
            pluck('target', 'value'),
            filter(v => {
                if(!v) clearItems();
                return !!v
            }),
            switchMap((v) => get(v)
                .catch(() => of([])))
        )
}

function get(v: string): Promise<any> {
    return fetch(`https://api.github.com/search/repositories?q=${v}`)
        .then((res: Response) => res.json());
}

function clearItems() {
    const element: HTMLInputElement = document.getElementById('result') as HTMLInputElement;
    element.innerHTML = '<h1>Not found :(</h1>';
}

function setItems(items: any[]) {
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
                    <div class="cell">${item.owner.login}</div>
                    <div class="cell"><a href='${item.html_url}' target="_blank">link</a></div>
                 </div>`;
    });
//     name: string,
//     watchers: number,
//     link: string,
//     language: string,
//     owner: {[key: string]: string},
//     [key: string]: string
    element.innerHTML = html;
    return;


}



