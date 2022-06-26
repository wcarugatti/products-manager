import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "../../../interfaces/entities/ProductEntity";

@Entity("products")
export class ProductModel extends BaseEntity implements ProductEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string
  
  @Column()
  lm: number;

  @Column()
  name: string;

  @Column({ name: "free_shipping" })
  freeShipping: number;

  @Column()
  description: string;

  @Column({ type: "float" })
  price: number;

  @Column()
  category: number;
}
