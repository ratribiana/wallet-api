'use strict'
import 'babel-polyfill'
import 'app-module-path/register'
import config from '../config'
import {dbConnect, dbDrop} from 'utils/dbConnector'
import mongoose from 'mongoose'

dbConnect( config )
dbDrop()
