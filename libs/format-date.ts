import { format } from 'date-fns';
import  cs  from 'date-fns/locale/cs'

const formatDate = (inputDate: string): string => {
    const dateToConvert = new Date(inputDate);
    return format(dateToConvert, 'do MMMM yyyy', { locale: cs });
};

export default formatDate;