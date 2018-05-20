defmodule Angelhack2018Web.Router do
  use Angelhack2018Web, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/", Angelhack2018Web do
    # Use the default browser stack
    pipe_through(:browser)

    get("/", PageController, :index)
    get("/language", PageController, :language)
    get("/english", PageController, :english)
    get("/order", PageController, :order)
  end

  # Other scopes may use custom stacks.
  # scope "/api", Angelhack2018Web do
  #   pipe_through :api
  # end
end
