
import { Model } from 'mongoose';
import { IApiPagination } from '../interfaces/api_spec.interface'

interface IFindOptions {
    sort ?:any,
    populate? :any,
    conditions? :any
    fields? :any
    options? :any
}


export class CURD<T> {
    dto : Model<T>
    constructor(dto :Model<T>){
        this.dto = dto
    }

    async pagination(page :number = 1 ,limit :number = 10,options? :IFindOptions) : Promise<IApiPagination> {
        page = page <= 0 ? 1 : page
        let sort;
        let total = 0;
        let rows;
        let ks = 0;

        if(options && options.sort){
            sort = options.sort
        }else{
            sort = { 'create_time' :-1 }
        }


        if(options){
            if(!options.populate){
                if(options.conditions){ ks = 1 }
                if(options.conditions && options.fields){ ks = 2 }
                if(options.conditions && options.fields && options.options){ ks = 3}
            }else{
                ks = 7
                if(options.conditions){ ks = 4 }
                if(options.conditions && options.fields){ ks = 5 }
                if(options.conditions && options.fields && options.options){ ks = 6 }
            }
    
            switch (ks) {
                case 1:
                    total = await this.dto.count(options.conditions);
                    rows = await this.dto.find(options.conditions).skip((page - 1) * limit).limit(limit).sort(sort)
                    break;
                case 2:
                    total = await this.dto.count(options.conditions);
                    rows = await this.dto.find(options.conditions,options.fields).skip((page - 1) * limit).limit(limit).sort(sort)
                    break;
                case 3:
                    total = await this.dto.count(options.conditions);
                    rows = await this.dto.find(options.conditions,options.fields,Object.assign({ limit ,skip :(page - 1) * limit ,sort },options))
                    break;
                case 4:
                    total = await this.dto.count(options.conditions);
                    rows = await this.dto.find(options.conditions).skip((page - 1) * limit).limit(limit).sort(sort).populate(options.populate)
                    break;
                case 5:
                    total = await this.dto.count(options.conditions);
                    rows = await this.dto.find(options.conditions,options.fields).skip((page - 1) * limit).limit(limit).sort(sort).populate(options.populate)
                    break;
                case 6:
                    total = await this.dto.count(options.conditions);
                    rows = await this.dto.find(options.conditions,options.fields,Object.assign({ limit ,skip :(page - 1) * limit},options)).populate(options.populate)
                    break;
                case 7:
                    total = await this.dto.count();
                    rows = await this.dto.find().skip((page - 1) * limit).limit(limit).sort(sort).populate(options.populate)
                    break;    
                default:
                    total = await this.dto.count();
                    rows = await this.dto.find().skip((page - 1) * limit).limit(limit).sort(sort)
                    break;
            }
        }else{
            total = await this.dto.count();
            rows = await this.dto.find().skip((page - 1) * limit).limit(limit).sort(sort)
        }

        return {
          currentPage :page,
          pageSize :limit,
          totalPage: Math.ceil(total / limit),
          total :total,
          rows :rows
        };
    }
}