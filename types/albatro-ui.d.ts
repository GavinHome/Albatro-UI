import Vue from "vue"

import { AlButton } from "./button"
import { AlCol } from './col'
import { AlRow } from './row'

/** The version of albatro-ui */
export const version: string

/**
 * Install all albatro-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(AlbatroUI)` to install.
 */
export function install (vue: typeof Vue, options: any): void

/** Button Component */
export class Button extends AlButton {}

/** Colunm Layout Component */
export class Col extends AlCol {}

/** Row Layout Component */
export class Row extends AlRow {}