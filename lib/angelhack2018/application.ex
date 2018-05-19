defmodule Angelhack2018.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      Angelhack2018.Repo,
      # Start the endpoint when the application starts
      Angelhack2018Web.Endpoint,
      # Starts a worker by calling: Angelhack2018.Worker.start_link(arg)
      # {Angelhack2018.Worker, arg},
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Angelhack2018.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Angelhack2018Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
