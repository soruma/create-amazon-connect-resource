import { Construct } from 'constructs';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as connect from 'aws-cdk-lib/aws-connect';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';

interface AmazonConnectConstructProps {
  connectInstanceAlias: string;
  recordingBucket: s3.Bucket;
  isCreateHierarchy: boolean;
}

export class AmazonConnectConstruct extends Construct {
  private readonly recordingBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: AmazonConnectConstructProps) {
    super(scope, id);

    this.recordingBucket = props.recordingBucket;

    const connectInstance = new connect.CfnInstance(this, id, {
      attributes: {
        inboundCalls: true,
        outboundCalls: true,
        contactflowLogs: true,
        autoResolveBestVoices: true,
      },
      identityManagementType: 'CONNECT_MANAGED',
      instanceAlias: props.connectInstanceAlias,
    });
    props.recordingBucket.grantWrite(new iam.ServicePrincipal('connect.amazonaws.com'));

    this.createInstanceStorageConfig(connectInstance);

    if (props.isCreateHierarchy) {
      this.createHierarchy(connectInstance);
    }
  }

  createInstanceStorageConfig(connectInstance: connect.CfnInstance) {
    const encriptionKey = kms.Key.fromLookup(this, 'EncryptKeyLookup', {
      aliasName: 'alias/aws/connect',
    });

    new connect.CfnInstanceStorageConfig(this, 'CallRecordingsStorageConfig', {
      instanceArn: connectInstance.attrArn,
      resourceType: 'CALL_RECORDINGS',
      storageType: 'S3',
      s3Config: {
        bucketName: this.recordingBucket.bucketName,
        bucketPrefix: 'CallRecordings',
        encryptionConfig: {
          encryptionType: 'KMS',
          keyId: encriptionKey.keyArn
        }
      }
    });
  
    new connect.CfnInstanceStorageConfig(this, 'ChatTranscriptsStorageConfig', {
      instanceArn: connectInstance.attrArn,
      resourceType: 'CHAT_TRANSCRIPTS',
      storageType: 'S3',
      s3Config: {
        bucketName: this.recordingBucket.bucketName,
        bucketPrefix: 'ChatTranscripts',
        encryptionConfig: {
          encryptionType: 'KMS',
          keyId: encriptionKey.keyArn
        }
      }
    });
  }

  createHierarchy(connectInstance: connect.CfnInstance) {
    new connect.CfnUserHierarchyStructure(this, 'DepartmentUserHierarchyStructure', {
      instanceArn: connectInstance.attrArn,
      userHierarchyStructure: {
        levelOne: {
          name: 'Department',
        },
        levelTwo: {
          name: 'Team',
        }
      }
    })

    const salesDepartment = new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentContactUserHierarchyGroup', {
      instanceArn: connectInstance.attrArn,
      name: 'Sales department',
    });

    new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentTeam1ContactUserHierarchyGroup', {
      instanceArn: connectInstance.attrArn,
      name: 'Team 1',
      parentGroupArn: salesDepartment.attrUserHierarchyGroupArn
    });

    new connect.CfnUserHierarchyGroup(this, 'SalesDepartmentTeam2ContactUserHierarchyGroup', {
      instanceArn: connectInstance.attrArn,
      name: 'Team 2',
      parentGroupArn: salesDepartment.attrUserHierarchyGroupArn
    });

    const supportDepartment = new connect.CfnUserHierarchyGroup(this, 'SupportDepartmentContactUserHierarchyGroup', {
      instanceArn: connectInstance.attrArn,
      name: 'Support department',
    });

    new connect.CfnUserHierarchyGroup(this, 'SupportDepartmentTeam1ContactUserHierarchyGroup', {
      instanceArn: connectInstance.attrArn,
      name: 'Team 1',
      parentGroupArn: supportDepartment.attrUserHierarchyGroupArn
    });
  }
}
