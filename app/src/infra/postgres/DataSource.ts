import { DataSource } from "typeorm";
import { ormConfig } from './config/ormconfig';

const dataSource = new DataSource(ormConfig)

export default dataSource