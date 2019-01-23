import INavigationNode from './INavigationNode';
import { NavigationNodeSearchAttributeEnum } from './INavigationNode';

export default class NavigationNodeUtils {
  public readonly homeRegex = /.*\/Home\.aspx$/gm;

  /**
   *
   * @param relativeUrl = reliveUrl of currentPage
   * @param nodeList = navigationNodeList for the current page
   *
   * @returns the nodePath from child to oldest parent
   */
  public getNodePath(relativeUrl: string, nodeList: INavigationNode[]): INavigationNode[] {
    const nodePath = [];
    let currentNode = this.getNodeFromAttribute(NavigationNodeSearchAttributeEnum.Url, relativeUrl, nodeList);
    nodePath.push(currentNode);
    if (currentNode !== null) {
      let tempsNode = this.getNodeFromAttribute(NavigationNodeSearchAttributeEnum.Id, currentNode.ParentId, nodeList);
      while (tempsNode !== null) {
        nodePath.push(tempsNode);
        tempsNode = this.getNodeFromAttribute(
          NavigationNodeSearchAttributeEnum.Id,
          tempsNode.ParentId,
          nodeList
        );
      }
    }
    return nodePath;
  }

  /**
   * SearchNodeFrom an Url, if the URL end by /Home.aspx, the Home Node is gived
   * @param attribute = this.props.context.pageContext.legacyPageContext.serverRequestPath
   * @param attribute =
   * @param nodeList = navigationNodeList for the current page (this.props.context.pageContext.legacyPageContext.navigationInfo.quickLaunch)
   *
   */
  private getNodeFromAttribute(attribute: NavigationNodeSearchAttributeEnum, searchedTerm: string, nodeList: INavigationNode[]): INavigationNode {
    let currentNode: INavigationNode = null;
    if (this.homeRegex.test(searchedTerm)) {
      currentNode = nodeList[0];
    } else {
      for (let node of nodeList) {
        currentNode = this.searchInNode(node, attribute, searchedTerm);
        if (currentNode !== null) {
          break;
        }
      }
    }
    return currentNode;
  }

  /**
   *
   * @param currentNode depart node
   * @attribute attribute name from INavigationNode, case sensitive
   * @param searchedTerm searched node attribute value, case sensitive
   */
  private searchInNode(currentNode: INavigationNode, attribute: NavigationNodeSearchAttributeEnum, searchedTerm: string): INavigationNode {
    //CAS 1 : La node donnée correspond à la recherche alors on la retourne
    if (currentNode[attribute] === searchedTerm) {
      return currentNode;
    } else {
      //CAS 2 : Si elle ne correspond pas on regarde si elle a des enfants
      if (currentNode.Children && currentNode.Children.length > 0) {
        let result;
        for (let childNode of currentNode.Children) {
          //CAS 3 : On itère sur ses enfants pour en trouver un qui  correspond à la recherche
          if (childNode[attribute] === searchedTerm) {
            //CAS 4 : C'est un des enfant alors on le renvoie et on termine la boucle pour passer au result
            result = childNode;
            break;
          } else {
            //Si la node sur laquelle on boucle ne correspond pas à la recherche, on relance la méthode pour analyser ses enfants
            result = this.searchInNode(childNode, attribute, searchedTerm);
            if (result !== null) {
              //Si la méthode retourne un résultat, c'est que on peut terminer la boucle et retourné la bonne node
              break;
            }
          }
        }
        return result;
      }
      //Si la node n'a pas d'enfant on retroune null car il n'y a plus de chemin
      return null;
    }
  }
}
