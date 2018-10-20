'use strict'
import {maintenance} from 'model/maintenance'
export const siteStatus = async () => await maintenance.findOne().exec()
