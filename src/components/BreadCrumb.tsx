import * as React from 'react';
import { IBreadCrumbProps } from './IBreadCrumbProps';
import { IBreadcrumbItem, Breadcrumb } from 'office-ui-fabric-react/lib';
import NavigationNodeUtils from '../utils/NavigationNodeUtils';
import INavigationNode from '../utils/INavigationNode';

export interface ISiteBreadcrumbProps {
  context: any;
  elementbefore?: IBreadcrumbItem[];
}

export interface ISiteBreadcrumbState {
  breadcrumbItems: IBreadcrumbItem[];
}

export default class BreadCrumb extends React.Component<
  ISiteBreadcrumbProps,
  ISiteBreadcrumbState
  > {
  private linkItems: IBreadcrumbItem[];
  private currentRelativeurl: string;
  private nodeUtils = new NavigationNodeUtils();

  constructor(props: ISiteBreadcrumbProps) {
    super(props);
    this.linkItems = [];

    this.currentRelativeurl = this.props.context.pageContext.legacyPageContext.serverRequestPath;
  }
  public componentWillMount() {
    const currentNav = this.props.context.pageContext.legacyPageContext.navigationInfo.quickLaunch;
    const navigationNodes: INavigationNode[] = this.nodeUtils.getNodePath(this.currentRelativeurl, currentNav).reverse();
    if (this.props.elementbefore) {
      this.pushArrayInLinkItems(this.props.elementbefore);
    }
    if (!this.nodeUtils.homeRegex.test(this.currentRelativeurl)) {
      this.linkItems.push({
        key: currentNav[0].Id,
        text: currentNav[0].Title,
        href: currentNav[0].Url
      });
    }
    navigationNodes.forEach(element => {
      this.linkItems.push({
        key: element.Id,
        text: element.Title,
        href: element.Url
      });
    });

    this.linkItems[this.linkItems.length - 1].isCurrentItem = true;
    console.log(this.linkItems);
  }


  private pushArrayInLinkItems(array: IBreadcrumbItem[]) {
    if (this.props.elementbefore) {
      array.forEach(element => {
        this.linkItems.push(element);
      });
    }
  }

  public render(): React.ReactElement<IBreadCrumbProps> {
    return <Breadcrumb items={this.linkItems} />;
  }
}
