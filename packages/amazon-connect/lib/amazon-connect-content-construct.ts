import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import * as connect from 'aws-cdk-lib/aws-connect';
import { Construct } from 'constructs';

import { AmazonConnectContentHierarchyGroupStack } from './amazon-connect-content-hierarchy-group-stack';

interface AmazonConnectContentConstructProps {
  /**
   * Amazon Connect instance ARN
   */
  connectInstanceArn: string;

  /**
   * Create sample Amazon Connect organization hierarchies
   */
  createHierarchy: boolean;

  /**
   * business hours time zone
   */
  businessHoursTimeZone: string;
}

export class AmazonConnectContentConstruct extends Construct {
  private props: AmazonConnectContentConstructProps;

  constructor(scope: Construct, id: string, props: AmazonConnectContentConstructProps) {
    super(scope, id);

    this.props = props;

    this.createBusinessHours();

    if (this.props.createHierarchy) {
      this.createHierarchy();
    }
  }

  createBusinessHours(): connect.CfnHoursOfOperation {
    const data = readFileSync(path.join(__dirname, '..', 'config', 'business_hours.json'), { encoding: 'utf8' });
    const config = JSON.parse(data) as connect.CfnHoursOfOperation.HoursOfOperationConfigProperty[];

    return new connect.CfnHoursOfOperation(this, 'HoursOfOperation', {
      instanceArn: this.props.connectInstanceArn,
      name: 'Business Hour',
      config,
      timeZone: this.props.businessHoursTimeZone,
    });
  }

  createHierarchy() {
    new connect.CfnUserHierarchyStructure(this, 'DepartmentUserHierarchyStructure', {
      instanceArn: this.props.connectInstanceArn,
      userHierarchyStructure: {
        levelOne: {
          name: 'Department',
        },
        levelTwo: {
          name: 'Team',
        },
      },
    });

    new AmazonConnectContentHierarchyGroupStack(this, 'AmazonConnectContentHierarchyGroupStack', {
      connectInstanceArn: this.props.connectInstanceArn,
    });
  }
}
