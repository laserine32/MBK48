import PageTitle from "../page/page-title"

const PageDashboard = ({ pageTitle }) => {
	return (
		<>
			<PageTitle>{pageTitle.toUpperCase()}</PageTitle>
		</>
	)
}

export default PageDashboard
