/**
 * @class ExampleComponent
 */

import * as React from 'react'

import styles from './styles.css'
import BreadCrumb from './components/BreadCrumb';
import { IBreadcrumbItem } from 'office-ui-fabric-react/lib';

export type Props = {
  context: any;
  elementbefore?: IBreadcrumbItem[];
}

export default class ExampleComponent extends React.Component<Props> {
  render() {
    const {
      context
    } = this.props

    return (
      <BreadCrumb context={this.props.context}></BreadCrumb>
    )
  }
}
