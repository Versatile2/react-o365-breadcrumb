export default interface INavigationNode {
    Title: string;
    Url: string;
    Id: string;
    ParentId: string;
    Children: INavigationNode[];
}

export enum NavigationNodeSearchAttributeEnum {
    Title = 'Title',
    Url = 'Url',
    Id = 'Id',
    ParentId = 'ParentId'

}