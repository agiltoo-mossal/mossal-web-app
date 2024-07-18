export interface IDataStatic{
    title:string,
    path:string;
    style:string;
    value?:number,
    svgContent?:string
}

export const dataStatic:IDataStatic[] = [
    {
        title:"Nombre de demandes accordés",
        path:"./assets/img/person.svg",
        style:"#40B139",
        value:0
    },
    {
        title:"Nombre de demandes en attente (actifs)",
        path:"./assets/img/people.svg",
        style:"#FFC708",
        value:0
    },
    {
        title:"Nombre de remboursements restants",
        path:"./assets/img/remboursement.svg",
        style:"#061E5C",
        value:0
    
    },
    {
        title:"Montant total des demandes",
        path:"./assets/img/demande.svg",
        style:"#40B139",
        value:0
    },
    {
        title:"Nombre d’inscrits",
        path:"./assets/img/person.svg",
        style:"#40B139",
        value:0
    },
    {
        title:"Montant remboursements restants",
        path:"./assets/img/montant-rb-restant.svg",
        style:"#FFC708",
        value:0
    }



]