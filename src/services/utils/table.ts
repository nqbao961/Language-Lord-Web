import { HeaderProps, Row } from 'react-table';

interface GetConditionalSelectHeaderCheckboxProps {
  /** react-table's header props */
  headerProps: React.PropsWithChildren<HeaderProps<any>>;
  /** A predicate - based on your business logic - to determine whether a given row should be selectable */
  checkIfRowIsSelectable: (row: Row<any>) => boolean;
  /** Whether to allow page selection. Default: true */
  shouldSelectPage?: boolean;
}

/**
 * A convenience method for react-table headers for allowing conditional select
 * @param headerProps react-table's header props
 * @param checkIfRowIsSelectable A predicate - based on your business logic - to determine whether a given row should be selectable
 * @param shouldSelectPage Whether to allow page selection. Default: true
 * @returns Modified `checkboxProps` to enforce the conditional select
 */
export const getConditionalSelectHeaderCheckboxProps = ({
  headerProps,
  checkIfRowIsSelectable,
  shouldSelectPage = true,
}: GetConditionalSelectHeaderCheckboxProps) => {
  // Note that in my comments I differentiate between the standard logic and the logic for the conditional select
  const checkIfAllSelectableRowsSelected = (rows: Row<any>[]) =>
    rows.filter(checkIfRowIsSelectable).every(row => row.isSelected);
  // Standard: Here we define the selection type for the next click: Select Page / Select All
  const isSelectPage =
    shouldSelectPage &&
    headerProps.page
      // For conditional select: Filter the rows based on your business logic
      .filter(checkIfRowIsSelectable)
      // Standard: `isSelectPage === true` if some of the rows are not yet selected
      .some(row => !row.isSelected);

  // Standard: Get the props based on Select Page / Select All
  const checkboxProps = isSelectPage
    ? headerProps.getToggleAllPageRowsSelectedProps()
    : headerProps.getToggleAllRowsSelectedProps();

  // For conditional select: The header checkbox should be:
  //   - checked if all selectable rows are selected
  //   - indeterminate if only some selectable rows are selected (but not all)
  const disabled = headerProps.page.filter(checkIfRowIsSelectable).length === 0;
  const checked =
    !disabled && checkIfAllSelectableRowsSelected(headerProps.page);
  const indeterminate =
    !checked && headerProps.rows.some(row => row.isSelected);

  // For conditional select: This is where the magic happens
  const onChange = () => {
    // If we're in Select All and all selectable page rows are already selected: deselect all page rows
    if (!isSelectPage && checkIfAllSelectableRowsSelected(headerProps.page)) {
      headerProps.page.forEach(row => {
        headerProps.toggleRowSelected(row.id, false);
      });
    } else {
      // Otherwise:
      // First, define the rows to work with: if we're in Select Page, use `headerProps.page`, otherwise (Select All) use headerProps.rows
      const rows = isSelectPage ? headerProps.page : headerProps.rows;
      // Then select every selectable row
      rows.forEach(row => {
        const checked = checkIfRowIsSelectable(row);
        headerProps.toggleRowSelected(row.id, checked);
      });
    }
  };

  // For conditional select: override checked, indeterminate and onChange - to enforce conditional select based on our business logic
  return {
    ...checkboxProps,
    checked,
    indeterminate,
    onChange,
    disabled,
  };
};
