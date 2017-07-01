# How to build HTML tables using the Data Visuals kit

The Data Visuals kit comes with a base set of styles for creating and styling HTML tables. They should get the job done in the vast majority of cases.

## Required SCSS imports

```scss
@import 'components/table';
```

## How your table should be structured

> Not real data, obviously.

```html
<table class="dv-table">
  <caption>Population of major Texas cities, 2017</caption>
  <thead>
    <tr>
      <th scope="col">City</th>
      <th scope="col" class="numeric-cell">Population</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Austin</th>
      <td class="numeric-cell">1,234</td>
    </tr>
    <tr>
      <th scope="row">Dallas</th>
      <td class="numeric-cell">1,234</td>
    </tr>
    <tr>
      <th scope="row">Houston</th>
      <td class="numeric-cell">1,234</td>
    </tr>
    <tr>
      <th scope="row">San Antonio</th>
      <td class="numeric-cell">1,234</td>
    </tr>
  </tbody>
</table>
```

## Key classes

#### `.dv-table`

**Valid tags**

`<table>`

This is the class that does most of the work. Without it, none of the other styles are applied. This is to ensure that our table styles don't bleed into other tables that may be on the page.

#### `.numerical-cell`

**Valid tags**

`<th>`, `<td>`

This class should be placed on any **individual** cells who's content needs to be aligned right. As the name suggests, this should be added to all the cells in a column that represents a numerical value, *including* the header cell.

#### `.nowrap-cell`

**Valid tags**

`<th>`, `<td>`

This class applies `white-space: nowrap;` to a cell, which prevents the content of the cell from wrapping. This is useful when you have something like an icon next to the text, but the table has decided to wrap the text in the least convenient place.

> Important! Make sure you check and see that adding this class doesn't cause an issue on mobile-sized widths. HTML tables **will** blow out of their containers if they cannot fit due to their content, and setting `.nowrap-cell` gives it less wiggle room to work with.

#### `.highlight-row`

**Valid tags**

`<tr>`

This class adds a faint, off-grey background color to an entire row. It also applies `font-weight: $font-weight-bold;` to all the text. **This is not for adding zebra striping to tables.** Use `.highlight-row` to call out the most interesting row of data in the table, or to draw attention to the row that totals all the other rows.

## Other questions

#### What do `scope="col"` and `scope="row"` do, and should I use them?

Yes, you should! These let screen readers know what the column and row headers are, and provide guidance as to how to interpret what's there. [Learn more at The A11Y Project](http://a11yproject.com/posts/accessible-data-tables/).

#### How do I control the width of the `<table>`?

Because the `.dv-table` class instructs the `<table>` element to attempt to fill 100% of its available width, the best way to do this is by setting your desired width on the container of the `<table>` element. It's not advised to set additional widths on the `<table>` - they can be a little funky.
