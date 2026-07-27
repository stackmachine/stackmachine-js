from __future__ import annotations

from typing import Any, Mapping, Optional

from typing_extensions import Unpack

from .._errors import StackMachineAPIError
from .._graphql import operations as gql
from .._models import (
    PackageDetails,
    ResolvedPackageVersion,
    SearchPackageVersion,
    YankedPackageVersion,
)
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import PackagesFilter, PaginationOptions, RequestOptionsLike
from .._utils import camelize
from ._shared import page_variables


def _search_variables(
    page_params: Mapping[str, Any], normalized: NormalizedPagination
) -> dict:
    return {
        "query": page_params.get("query") or "",
        "packages": camelize(page_params.get("filter") or {}),
        **page_variables(normalized),
    }


def _yank_variables(
    version_ids: list[str],
    reason: Optional[str],
    undo: bool,
) -> dict:
    return {
        "input": {
            "packageVersionIds": version_ids,
            "reason": reason,
            "undo": undo,
        }
    }


def _yank_result(response: Optional[Mapping[str, Any]]) -> list[YankedPackageVersion]:
    payload = (response or {}).get("yankPackageVersions") or {}
    return [
        YankedPackageVersion.from_graphql(version)
        for version in payload.get("packageVersions") or []
    ]


def _package_id(response: Optional[Mapping[str, Any]], package_name: str) -> str:
    package = (response or {}).get("getPackage")
    if not package:
        raise StackMachineAPIError(
            f"Package '{package_name}' was not found.",
            operation_name="srcGetPackageIdQuery",
        )
    return str(package["id"])


def _archived_result(response: Optional[Mapping[str, Any]]) -> bool:
    payload = (response or {}).get("setPackageArchived") or {}
    package = payload.get("package") or {}
    return bool(package.get("isArchived"))


class PackageVersionsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    def resolve(
        self,
        package_name: str,
        selector: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> Optional[ResolvedPackageVersion]:
        """Resolve an exact version, semver range, or tag such as ``latest``."""
        response = self._client._query(
            gql.RESOLVE_PACKAGE_VERSION_QUERY,
            {"name": package_name, "version": selector},
            request_options=request_options,
        )
        version = (response or {}).get("getPackageVersion")
        return ResolvedPackageVersion.from_graphql(version) if version else None


class AsyncPackageVersionsResource:
    def __init__(self, client: Any) -> None:
        self._client = client

    async def resolve(
        self,
        package_name: str,
        selector: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> Optional[ResolvedPackageVersion]:
        """Resolve an exact version, semver range, or tag such as ``latest``."""
        response = await self._client._query(
            gql.RESOLVE_PACKAGE_VERSION_QUERY,
            {"name": package_name, "version": selector},
            request_options=request_options,
        )
        version = (response or {}).get("getPackageVersion")
        return ResolvedPackageVersion.from_graphql(version) if version else None


class PackagesResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.versions = PackageVersionsResource(client)

    def retrieve(
        self,
        package_name: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> PackageDetails:
        """Retrieve a package by its fully-qualified registry name."""
        response = self._client._query(
            gql.GET_PACKAGE_QUERY,
            {"name": package_name},
            request_options=request_options,
        )
        package = (response or {}).get("getPackage")
        if not package:
            raise StackMachineAPIError(
                f"Package '{package_name}' was not found.",
                operation_name="srcGetPackageQuery",
            )
        return PackageDetails.from_graphql(package)

    def search(
        self,
        *,
        query: str = "",
        filter: Optional[PackagesFilter] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[SearchPackageVersion]:
        params = {"query": query, "filter": filter, **pagination}

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                gql.SEARCH_PACKAGES_QUERY,
                _search_variables(page_params, normalized),
                request_options=request_options,
            )
            return connection_to_page_data(
                response.get("search") if response else None,
                SearchPackageVersion.from_graphql,
            )

        return create_list(params, "/v1/packages", fetch_page)

    def yank(
        self,
        version_ids: list[str],
        *,
        reason: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[YankedPackageVersion]:
        """Yank the given package versions, by node id.

        Requires package-admin rights, and all ids must belong to the same
        package. Returns only the versions whose yank state changed, so
        re-yanking an already-yanked version returns an empty list.
        """
        response = self._client._mutation(
            gql.YANK_PACKAGE_VERSIONS_MUTATION,
            _yank_variables(version_ids, reason, False),
            request_options=request_options,
        )
        return _yank_result(response)

    def unyank(
        self,
        version_ids: list[str],
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[YankedPackageVersion]:
        """Restore the given previously yanked package versions, by node id."""
        response = self._client._mutation(
            gql.YANK_PACKAGE_VERSIONS_MUTATION,
            _yank_variables(version_ids, None, True),
            request_options=request_options,
        )
        return _yank_result(response)

    def set_archived(
        self,
        package_name: str,
        archived: bool,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> bool:
        """Set (or clear) a package's archived state. Requires package-admin rights.

        Archiving hides the package from search and listings. It has no effect
        on resolution, so apps and dependencies already pointing at it keep
        working.
        """
        lookup = self._client._query(
            gql.GET_PACKAGE_ID_QUERY,
            {"name": package_name},
            request_options=request_options,
        )
        response = self._client._mutation(
            gql.SET_PACKAGE_ARCHIVED_MUTATION,
            {"id": _package_id(lookup, package_name), "archived": archived},
            request_options=request_options,
        )
        return _archived_result(response)

    def archive(
        self,
        package_name: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> bool:
        """Archive (delist) a package. Shorthand for ``set_archived(name, True)``."""
        return self.set_archived(package_name, True, request_options=request_options)

    def unarchive(
        self,
        package_name: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> bool:
        """Restore a previously archived package. ``set_archived(name, False)``."""
        return self.set_archived(package_name, False, request_options=request_options)


class AsyncPackagesResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.versions = AsyncPackageVersionsResource(client)

    async def retrieve(
        self,
        package_name: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> PackageDetails:
        """Retrieve a package by its fully-qualified registry name."""
        response = await self._client._query(
            gql.GET_PACKAGE_QUERY,
            {"name": package_name},
            request_options=request_options,
        )
        package = (response or {}).get("getPackage")
        if not package:
            raise StackMachineAPIError(
                f"Package '{package_name}' was not found.",
                operation_name="srcGetPackageQuery",
            )
        return PackageDetails.from_graphql(package)

    def search(
        self,
        *,
        query: str = "",
        filter: Optional[PackagesFilter] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[SearchPackageVersion]:
        params = {"query": query, "filter": filter, **pagination}

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                gql.SEARCH_PACKAGES_QUERY,
                _search_variables(page_params, normalized),
                request_options=request_options,
            )
            return connection_to_page_data(
                response.get("search") if response else None,
                SearchPackageVersion.from_graphql,
            )

        return create_async_list(params, "/v1/packages", fetch_page)

    async def yank(
        self,
        version_ids: list[str],
        *,
        reason: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[YankedPackageVersion]:
        """Yank the given package versions, by node id.

        Requires package-admin rights, and all ids must belong to the same
        package. Returns only the versions whose yank state changed, so
        re-yanking an already-yanked version returns an empty list.
        """
        response = await self._client._mutation(
            gql.YANK_PACKAGE_VERSIONS_MUTATION,
            _yank_variables(version_ids, reason, False),
            request_options=request_options,
        )
        return _yank_result(response)

    async def unyank(
        self,
        version_ids: list[str],
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> list[YankedPackageVersion]:
        """Restore the given previously yanked package versions, by node id."""
        response = await self._client._mutation(
            gql.YANK_PACKAGE_VERSIONS_MUTATION,
            _yank_variables(version_ids, None, True),
            request_options=request_options,
        )
        return _yank_result(response)

    async def set_archived(
        self,
        package_name: str,
        archived: bool,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> bool:
        """Set (or clear) a package's archived state. Requires package-admin rights.

        Archiving hides the package from search and listings. It has no effect
        on resolution, so apps and dependencies already pointing at it keep
        working.
        """
        lookup = await self._client._query(
            gql.GET_PACKAGE_ID_QUERY,
            {"name": package_name},
            request_options=request_options,
        )
        response = await self._client._mutation(
            gql.SET_PACKAGE_ARCHIVED_MUTATION,
            {"id": _package_id(lookup, package_name), "archived": archived},
            request_options=request_options,
        )
        return _archived_result(response)

    async def archive(
        self,
        package_name: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> bool:
        """Archive (delist) a package. Shorthand for ``set_archived(name, True)``."""
        return await self.set_archived(
            package_name, True, request_options=request_options
        )

    async def unarchive(
        self,
        package_name: str,
        *,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> bool:
        """Restore a previously archived package. ``set_archived(name, False)``."""
        return await self.set_archived(
            package_name, False, request_options=request_options
        )
