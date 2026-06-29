export class Province {
    id: number = 0;
    name: string = '';
}

export class District {
    id: number = 0;
    name: string = '';
    provinceId: number = 0;
}

export class Neighbourhood {
    id: number = 0;
    name: string = '';
    districtId: number = 0;
}
