export type ObjectIdentifier = {
  ObjectName: string;
  ObjectPath: string;
};

export type BlueprintEntry<
  T = object,
  Properties = Record<string, unknown>
> = T & {
  Type: string;
  Name: string;
  Class?: string;
  Properties?: Properties;
};

export type Blueprint = Array<BlueprintEntry>;

export type DataTableIdentifier = {
  ObjectName: string;
  ObjectPath: string;
};

export type DataTableRowHandle = {
  DataTable: DataTableIdentifier;
  RowName: string;
};

export type DataTableBlueprintEntry<RowDataType> = BlueprintEntry<
  {
    Rows: Record<string, RowDataType>;
  },
  {
    RowStruct: {
      ObjectName: string;
      ObjectPath: string;
    };
  }
>;

export type StringHandle =
  | {
      Namespace: string;
      Key: string;
      SourceString: string;
      LocalizedString: string;
    }
  | {
      TableId: string;
      Key: string;
      CultureInvariantString?: string | null;
    }
  | {
      CultureInvariantString: string | null;
    };

export type StringTableBlueprintEntry = BlueprintEntry<{
  StringTable: {
    TableNamespace: string;
    KeysToMetaData: Record<string, string>;
  };
}>;

export type EnumBlueprintEntry = BlueprintEntry<
  {
    Names: Record<string, number>;
  },
  {
    DisplayNameMap: Array<Record<string, StringHandle>>;
  }
>;

export interface AssetHandle {
  AssetPathName: string;
  SubPathString: string;
}
