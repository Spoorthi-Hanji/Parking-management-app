export type lotDetailsType = {
    id: number;
    reg: string;
    free: boolean;
    start: Date;
  };
  
  export type routesType = {
    Lots: {
      lots: number;
    };
  };
  
  export type lotsPropsType = {
    route: {
      params: {
        lots: number;
      };
    };
  };