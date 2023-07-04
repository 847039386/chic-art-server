
import { IOperatorLog } from '../interfaces/log.interface'


export const FormatOperatorDescription = function(log_obje :IOperatorLog){
    const name = log_obje.user_id.name || 'Host'
    return `${name}`
}

 