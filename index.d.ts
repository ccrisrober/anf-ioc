/**
 * Copyright (c) 2016, maldicion069 (Cristian Rodríguez) <ccrisrober@gmail.con>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */
declare class IOCDepNotFound extends Error {
    message: string;
    name: string;
    constructor(message?: string);
}
interface IIOC {
    $get(key: string): any;
    $set(key: string, value: any, check_exist?: boolean): void;
    $inject(...args: any[]): void;
    $invoke(args: Array<string>, fn: Function): void;
    $call(fn: Function): void;
    $remove(key: string): void;
    $addList(list: {
        [key: string]: any;
    }): void;
    $singleton(key: string, fn: Function): any;
}
declare class IOC implements IIOC {
    private _data;
    constructor();
    $get(key: string): any;
    $set(key: string, value: any, check_exist?: boolean): void;
    $inject(...args: any[]): any;
    $invoke(args: Array<string>, fn: Function): any;
    $call(fn: Function): any;
    $remove(key: string): void;
    $addList(list: {
        [key: string]: any;
    }): void;
    $singleton(key: string, fn: Function): this;
    protected _getArgs(fn: Function): Array<string>;
    protected _item(key: string): any;
    protected _has(key: string): boolean;
    protected _getAll(): {
        [key: string]: any;
    };
    protected _clear(): void;
    protected _keys(): Array<string>;
}
