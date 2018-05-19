defmodule Angelhack2018Web.PageController do
  use Angelhack2018Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
